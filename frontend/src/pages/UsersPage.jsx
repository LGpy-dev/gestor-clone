import { useEffect, useRef, useState } from 'react';
import AppMenu from '../components/AppMenu';
import { request } from '../services/api';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { useAuth } from '../context/AuthContext';

const TOAST_LIFE = 4200;
const TOAST_SUCCESS_LIFE = 3200;
const PAGE_SIZE = 10;

const roleOptions = [
  { label: 'Administrador', value: 'adm' },
  { label: 'Usuario', value: 'user' }
];

const emptyForm = {
  _id: null,
  name: '',
  cpf: '',
  email: '',
  password: '',
  role: 'user'
};

function isBlank(value) {
  return !String(value ?? '').trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@([^\s@.]+\.)+[A-Za-z]{2,}$/.test(String(value ?? '').trim());
}

function formatCpf(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return digits.replace(/(\d{3})(\d+)/, '$1.$2');
  }

  if (digits.length <= 9) {
    return digits.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
  }

  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, '$1.$2.$3-$4');
}

function isValidCpf(value) {
  return String(value ?? '').replace(/\D/g, '').length === 11;
}

export default function UsersPage() {
  const { user } = useAuth();
  const canManage = user?.role !== 'user';
  const toast = useRef(null);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [selectedItem, setSelectedItem] = useState(null);
  const [invalidFields, setInvalidFields] = useState({});
  const [saving, setSaving] = useState(false);
  const [first, setFirst] = useState(0);

  async function load() {
    const data = await request('/users');
    const visibleItems = canManage
      ? data
      : data.filter((item) => String(item._id || item.id) === String(user?.id));

    setItems(visibleItems);
  }

  useEffect(() => {
    load();
  }, [canManage, user?.id]);

  useEffect(() => {
    const lastValidFirst = Math.max(0, Math.floor(Math.max(items.length - 1, 0) / PAGE_SIZE) * PAGE_SIZE);
    if (first > lastValidFirst) {
      setFirst(lastValidFirst);
    }
  }, [items.length, first]);

  function newItem() {
    setForm(emptyForm);
    setInvalidFields({});
    setSaving(false);
    setOpen(true);
  }

  function editItem(row) {
    setForm({
      ...row,
      cpf: formatCpf(row.cpf),
      password: ''
    });
    setInvalidFields({});
    setSaving(false);
    setOpen(true);
  }

  function viewItem(row) {
    setSelectedItem(row);
    setViewOpen(true);
  }

  async function save() {
    if (saving) {
      return;
    }

    const needsPassword = !form._id;
    const nextInvalidFields = {
      name: isBlank(form.name),
      cpf: isBlank(form.cpf) || !isValidCpf(form.cpf),
      email: isBlank(form.email) || !isValidEmail(form.email),
      password: needsPassword && isBlank(form.password),
      role: !form.role
    };

    if (Object.values(nextInvalidFields).some(Boolean)) {
      setInvalidFields(nextInvalidFields);
      toast.current?.show({
        severity: 'warn',
        summary: 'Campos obrigatorios',
        detail: nextInvalidFields.cpf
          ? 'Informe um CPF valido antes de salvar.'
          : nextInvalidFields.email
            ? 'Informe um e-mail valido antes de salvar.'
            : needsPassword
              ? 'Preencha nome, CPF, e-mail, senha e perfil antes de salvar.'
              : 'Preencha nome, CPF, e-mail e perfil antes de salvar.',
        life: TOAST_LIFE
      });
      return;
    }

    setInvalidFields({});
    setSaving(true);

    const payload = {
      name: form.name,
      cpf: form.cpf,
      email: form.email,
      role: form.role,
      ...(form.password ? { password: form.password } : {})
    };

    try {
      if (form._id) {
        await request(`/users/${form._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await request('/users', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      setOpen(false);
      await load();
      toast.current?.show({
        severity: 'success',
        summary: form._id ? 'Usuario atualizado' : 'Usuario criado',
        detail: `${form.name} foi ${form._id ? 'editado' : 'criado'}.`,
        life: TOAST_SUCCESS_LIFE
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Falha ao salvar',
        detail: error.message || 'Nao foi possivel salvar o usuario.',
        life: TOAST_LIFE
      });
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(row) {
    if (row.active !== false) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Desative o acesso antes de excluir',
        detail: 'So e possivel excluir usuarios com o acesso desativado.',
        life: TOAST_LIFE
      });
      return;
    }

    confirmDialog({
      message: `Deseja excluir ${row.name}?`,
      header: 'Confirmar exclusao',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        try {
          await request(`/users/${row._id}`, { method: 'DELETE' });
          await load();
          toast.current?.show({
            severity: 'error',
            summary: 'Usuario removido',
            detail: `${row.name} foi excluido.`,
            life: TOAST_SUCCESS_LIFE
          });
        } catch (error) {
          toast.current?.show({
            severity: 'warn',
            summary: 'Exclusao nao permitida',
            detail: error.message || 'Desative o acesso do usuario antes de exclui-lo.',
            life: TOAST_LIFE
          });
        }
      }
    });
  }

  async function toggleActive(row, nextActive = !row.active) {
    await request(`/users/${row._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: row.name,
        cpf: row.cpf,
        email: row.email,
        role: row.role,
        active: nextActive
      })
    });

    await load();
    toast.current?.show({
      severity: nextActive ? 'success' : 'warn',
      summary: nextActive ? 'Acesso ativado' : 'Acesso desativado',
      detail: `${row.name} foi ${nextActive ? 'ativado' : 'desativado'}.`,
      life: TOAST_SUCCESS_LIFE
    });
  }

  const currentItems = items.slice(first, first + PAGE_SIZE);

  function renderStatus(row) {
    return (
      <div className="table-control-cell">
        <span className={`status-badge ${row.active === false ? 'is-inactive' : 'is-active'}`}>
          {row.active === false ? 'Inativo' : 'Ativo'}
        </span>
      </div>
    );
  }

  function renderActions(row) {
    return (
      <div className="table-control-cell">
        <div className="row-actions">
          <Button icon="pi pi-eye" text tooltip="Visualizar" tooltipOptions={{ position: 'top' }} aria-label="Visualizar" className="action-button action-view" onClick={() => viewItem(row)} />
          {canManage && <Button icon="pi pi-pencil" text tooltip="Editar" tooltipOptions={{ position: 'top' }} aria-label="Editar" className="action-button action-edit" onClick={() => editItem(row)} />}
          {canManage && <Button icon="pi pi-trash" text severity="danger" tooltip="Excluir" tooltipOptions={{ position: 'top' }} aria-label="Excluir" className="action-button action-delete" onClick={() => removeItem(row)} />}
        </div>
      </div>
    );
  }

  function renderAccess(row) {
    return (
      <div className="table-control-cell">
        <div className="access-action">
          <InputSwitch checked={row.active !== false} onChange={(e) => toggleActive(row, e.value)} />
          <span className={`access-label ${row.active === false ? 'is-off' : 'is-on'}`}>
            {row.active === false ? 'Desativado' : 'Ativado'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Toast
        ref={toast}
        position="top-right"
        baseZIndex={open || viewOpen ? 2600 : 1000}
        appendTo={open || viewOpen ? document.body : 'self'}
        className={open || viewOpen ? 'toast-elevated' : ''}
      />
      <ConfirmDialog />
      <AppMenu />

      <div className="page-content">
        <div className="page-header">
          <div className="page-title">
            <h2>Usuarios</h2>
            <p>Visualize perfis cadastrados e mantenha o controle de acessos.</p>
          </div>
          {canManage && <Button label="Novo usuario" icon="pi pi-plus" onClick={newItem} />}
        </div>

        <DataTable value={items} paginator rows={PAGE_SIZE} first={first} onPage={(e) => setFirst(e.first)} stripedRows className="data-shell table-desktop">
          <Column field="name" header="Nome" />
          <Column field="cpf" header="CPF" body={(row) => formatCpf(row.cpf)} />
          <Column field="email" header="E-mail" />
          <Column field="role" header="Perfil" />
          <Column
            header="Status"
            headerStyle={{ textAlign: 'center' }}
            bodyStyle={{ textAlign: 'center' }}
            headerClassName="control-column status-column"
            bodyClassName="control-column-cell status-column"
            style={{ width: '9rem' }}
            body={renderStatus}
          />
          <Column
            header="Acoes"
            headerStyle={{ textAlign: 'center' }}
            bodyStyle={{ textAlign: 'center' }}
            headerClassName="control-column actions-column"
            bodyClassName="control-column-cell actions-column"
            style={{ width: '10rem' }}
            body={renderActions}
          />
          {canManage && (
            <Column
              header="Acesso"
              headerStyle={{ textAlign: 'center' }}
              bodyStyle={{ textAlign: 'center' }}
              headerClassName="control-column access-column"
              bodyClassName="control-column-cell access-column"
              style={{ width: '13rem' }}
              body={renderAccess}
            />
          )}
        </DataTable>

        <div className="data-shell mobile-card-shell">
          <div className="mobile-card-list">
            {currentItems.map((row) => (
              <article key={row._id} className="mobile-data-card">
                <div className="mobile-card-head">
                  <div className="mobile-card-title-block">
                    <strong>{row.name}</strong>
                  </div>
                  {renderStatus(row)}
                </div>

                <div className="mobile-card-grid">
                  <div className="mobile-card-field">
                    <span className="mobile-card-label">CPF</span>
                    <span className="mobile-card-value">{formatCpf(row.cpf)}</span>
                  </div>

                  <div className="mobile-card-field">
                    <span className="mobile-card-label">Perfil</span>
                    <span className="mobile-card-value">{row.role}</span>
                  </div>

                  <div className="mobile-card-field mobile-card-field-full">
                    <span className="mobile-card-label">E-mail</span>
                    <span className="mobile-card-value">{row.email}</span>
                  </div>
                </div>

                <div className="mobile-card-footer">
                  <div className="mobile-card-section">
                    <span className="mobile-card-section-title">Acoes</span>
                    {renderActions(row)}
                  </div>

                  {canManage && (
                    <div className="mobile-card-section">
                      <span className="mobile-card-section-title">Acesso</span>
                      {renderAccess(row)}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          <Paginator first={first} rows={PAGE_SIZE} totalRecords={items.length} onPageChange={(e) => setFirst(e.first)} />
        </div>
      </div>

      <Dialog header="Visualizar usuario" visible={viewOpen} style={{ width: '30rem' }} onHide={() => setViewOpen(false)}>
        <div className="form-col">
          <label>Nome</label>
          <InputText value={selectedItem?.name || ''} readOnly />

          <label>CPF</label>
          <InputText value={formatCpf(selectedItem?.cpf || '')} readOnly />

          <label>E-mail</label>
          <InputText value={selectedItem?.email || ''} readOnly />

          <label>Perfil</label>
          <InputText value={selectedItem?.role || ''} readOnly />
        </div>
      </Dialog>

      {canManage && (
        <Dialog header="Usuario" visible={open} style={{ width: '30rem' }} onHide={() => setOpen(false)}>
          <div className="form-col">
            <label>Nome</label>
            <InputText
              className={invalidFields.name ? 'p-invalid' : ''}
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setInvalidFields((current) => ({ ...current, name: false }));
              }}
            />

            <label>CPF</label>
            <InputText
              inputMode="numeric"
              className={invalidFields.cpf ? 'p-invalid' : ''}
              value={form.cpf}
              onChange={(e) => {
                setForm({ ...form, cpf: formatCpf(e.target.value) });
                setInvalidFields((current) => ({ ...current, cpf: false }));
              }}
            />

            <label>E-mail</label>
            <InputText
              type="email"
              className={invalidFields.email ? 'p-invalid' : ''}
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value.toLowerCase() });
                setInvalidFields((current) => ({ ...current, email: false }));
              }}
            />

            <label>Senha</label>
            <InputText
              className={invalidFields.password ? 'p-invalid' : ''}
              value={form.password}
              onChange={(e) => {
                setForm({ ...form, password: e.target.value });
                setInvalidFields((current) => ({ ...current, password: false }));
              }}
            />

            <label>Perfil</label>
            <Dropdown
              className={invalidFields.role ? 'p-invalid' : ''}
              value={form.role}
              options={roleOptions}
              onChange={(e) => {
                setForm({ ...form, role: e.value });
                setInvalidFields((current) => ({ ...current, role: false }));
              }}
            />

            <Button
              label={saving ? (form._id ? 'Editando...' : 'Salvando...') : (form._id ? 'Editar' : 'Salvar')}
              loading={saving}
              disabled={saving}
              onClick={save}
            />
          </div>
        </Dialog>
      )}
    </div>
  );
}

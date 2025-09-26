import { useState } from 'react';
import { PhoneIcon, PencilIcon, CheckIcon, XMarkIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const ContactDataSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Carlos Mendoza',
      position: 'Gerente General',
      phone: '+51 (01) 234-5678',
      email: 'carlos.mendoza@miempresa.com',
      department: 'Administración'
    },
    {
      id: 2,
      name: 'Ana Rivera',
      position: 'Coordinadora de Tours',
      phone: '+51 987-654-321',
      email: 'ana.rivera@miempresa.com',
      department: 'Operaciones'
    },
    {
      id: 3,
      name: 'Miguel Torres',
      position: 'Atención al Cliente',
      phone: '+51 976-543-210',
      email: 'miguel.torres@miempresa.com',
      department: 'Ventas'
    }
  ]);

  const [newContact, setNewContact] = useState({
    name: '',
    position: '',
    phone: '',
    email: '',
    department: ''
  });

  const handleAddContact = () => {
    if (newContact.name && newContact.phone && newContact.email) {
      const contact = {
        id: Date.now(),
        ...newContact
      };
      setContacts([...contacts, contact]);
      setNewContact({
        name: '',
        position: '',
        phone: '',
        email: '',
        department: ''
      });
    }
  };

  const handleDeleteContact = (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const handleSave = () => {
    console.log('Guardando datos de contacto:', contacts);
    setIsEditing(false);
    alert('✅ Datos de contacto actualizados correctamente');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-green-100 rounded-lg">
            <PhoneIcon className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Datos de contacto</h3>
            <p className="text-sm text-gray-500">Personas de contacto importantes</p>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title={isCollapsed ? 'Expandir sección' : 'Contraer sección'}
          >
            {isCollapsed ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronUpIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {!isCollapsed && (
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckIcon className="w-4 h-4" />
                Guardar
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
                Cancelar
              </button>
            </div>
          )
        )}
      </div>

      {!isCollapsed && (
        <div>
          {/* Lista de contactos */}
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => {
                          const updatedContacts = contacts.map(c => 
                            c.id === contact.id ? { ...c, name: e.target.value } : c
                          );
                          setContacts(updatedContacts);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{contact.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={contact.position}
                        onChange={(e) => {
                          const updatedContacts = contacts.map(c => 
                            c.id === contact.id ? { ...c, position: e.target.value } : c
                          );
                          setContacts(updatedContacts);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{contact.position}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento
                    </label>
                    {isEditing ? (
                      <select
                        value={contact.department}
                        onChange={(e) => {
                          const updatedContacts = contacts.map(c => 
                            c.id === contact.id ? { ...c, department: e.target.value } : c
                          );
                          setContacts(updatedContacts);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Administración">Administración</option>
                        <option value="Operaciones">Operaciones</option>
                        <option value="Ventas">Ventas</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Recursos Humanos">Recursos Humanos</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{contact.department}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        placeholder="9XXXXXXXX"
                        maxLength="9"
                        pattern="9[0-9]{8}"
                        value={contact.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value === '' || (value[0] === '9' && value.length <= 9)) {
                            const updatedContacts = contacts.map(c => 
                              c.id === contact.id ? { ...c, phone: value } : c
                            );
                            setContacts(updatedContacts);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{contact.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => {
                          const updatedContacts = contacts.map(c => 
                            c.id === contact.id ? { ...c, email: e.target.value } : c
                          );
                          setContacts(updatedContacts);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                        {contact.email}
                      </a>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex items-end">
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Formulario para agregar nuevo contacto */}
            {isEditing && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Agregar nuevo contacto</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Nombre completo *"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Cargo"
                      value={newContact.position}
                      onChange={(e) => setNewContact({ ...newContact, position: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <select
                      value={newContact.department}
                      onChange={(e) => setNewContact({ ...newContact, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Departamento</option>
                      <option value="Administración">Administración</option>
                      <option value="Operaciones">Operaciones</option>
                      <option value="Ventas">Ventas</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Recursos Humanos">Recursos Humanos</option>
                    </select>
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="9XXXXXXXX (9 dígitos)"
                      maxLength="9"
                      pattern="9[0-9]{8}"
                      value={newContact.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value === '' || (value[0] === '9' && value.length <= 9)) {
                          setNewContact({ ...newContact, phone: value });
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Email *"
                      value={newContact.email}
                      onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddContact}
                      disabled={!newContact.name || !newContact.phone || !newContact.email}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nota informativa */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <span className="font-medium">💡 Tip:</span> Mantén actualizada la información de contacto del personal clave para una comunicación eficiente con clientes y proveedores.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDataSection;
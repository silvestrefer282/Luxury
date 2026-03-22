import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Hooks
import { useAdminDashboard } from './admin/hooks/useAdminDashboard';

// Components
import AdminSidebar from './admin/components/AdminSidebar';
import AdminTopbar from './admin/components/AdminTopbar';
import ConfirmDialog from './admin/components/ConfirmDialog';

// Views
import DashboardView from './admin/views/DashboardView';
import ReservationsView from './admin/views/ReservationsView';
import PackagesView from './admin/views/PackagesView';
import AdicionalesView from './admin/views/AdicionalesView';
import MenusView from './admin/views/MenusView';
import GalleryView from './admin/views/GalleryView';
import ContractsView from './admin/views/ContractsView';
import TestimoniosView from './admin/views/TestimoniosView';
import UsersView from './admin/views/UsersView';
import ConfiguracionView from './admin/views/ConfiguracionView';

// Modals
import PackageModal from './admin/modals/PackageModal';
import AdicionalModal from './admin/modals/AdicionalModal';
import MenuCategoryModal from './admin/modals/MenuCategoryModal';
import ReservationModal from './admin/modals/ReservationModal';
import ContractModal from './admin/modals/ContractModal';
import PaymentModal from './admin/modals/PaymentModal';
import GalleryUploadModal from './admin/modals/GalleryUploadModal';
import GalleryEditModal from './admin/modals/GalleryEditModal';
import UserModal from './admin/modals/UserModal';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const dashboard = useAdminDashboard();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderActiveView = () => {
        switch (dashboard.activeTab) {
            case 'dashboard': return <DashboardView reservas={dashboard.reservas} clients={dashboard.clients} />;
            case 'reservations': return (
                <ReservationsView 
                    {...dashboard} 
                    setSelectedReservationForContract={dashboard.setSelectedReservationForContract}
                    triggerAlert={dashboard.triggerAlert}
                />
            );
            case 'packages': return <PackagesView {...dashboard} />;
            case 'adicionales': return <AdicionalesView {...dashboard} />;
            case 'menus': return <MenusView {...dashboard} />;
            case 'gallery': return <GalleryView {...dashboard} />;
            case 'contracts': return <ContractsView {...dashboard} contractFilter={dashboard.contractFilter} setContractFilter={dashboard.setContractFilter} />;
            case 'testimonios': return <TestimoniosView {...dashboard} />;
            case 'users': return <UsersView {...dashboard} userRoleFilter={dashboard.userRoleFilter} setUserRoleFilter={dashboard.setUserRoleFilter} />;
            case 'settings': return (
                <ConfiguracionView 
                    configForm={dashboard.configForm}
                    handleConfigChange={dashboard.handleConfigChange}
                    handleUpdateConfig={dashboard.handleUpdateConfig}
                />
            );
            default: return <DashboardView reservas={dashboard.reservas} clients={dashboard.clients} />;
        }
    };

    return (
        <div className="flex bg-luxury-white min-h-screen font-sans selection:bg-luxury-black selection:text-white">
            <AdminSidebar 
                activeTab={dashboard.activeTab} 
                setActiveTab={dashboard.setActiveTab} 
                userRole={dashboard.userRole}
                onLogout={logout}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <main className="flex-1 ml-0 md:ml-80 p-6 md:p-16 custom-scrollbar h-screen overflow-y-auto bg-[#fafafa]">
                <AdminTopbar 
                    activeTab={dashboard.activeTab}
                    searchTerm={dashboard.searchTerm}
                    setSearchTerm={dashboard.setSearchTerm}
                    userRole={dashboard.userRole}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    onAddClick={() => {
                        if (dashboard.activeTab === 'packages') {
                            dashboard.resetPackageForm();
                            dashboard.setIsAddingPackage(true);
                        }
                        if (dashboard.activeTab === 'adicionales') {
                            dashboard.resetAdicionalForm();
                            dashboard.setIsAddingAdicional(true);
                        }
                        if (dashboard.activeTab === 'gallery') dashboard.setIsAddingGallery(true);
                        if (dashboard.activeTab === 'reservations') dashboard.setIsAddingReservation(true);
                        if (dashboard.activeTab === 'users') {
                            dashboard.resetUserForm();
                            dashboard.setIsAddingUser(true);
                        }
                        if (dashboard.activeTab === 'menus') {
                            dashboard.triggerPrompt(
                                "Nueva Categoría",
                                "Ingrese el nombre de la nueva categoría (Ej. Postres):",
                                (newCategory) => {
                                    if (newCategory?.trim()) {
                                        dashboard.handleCreateCategory(newCategory.trim());
                                    }
                                }
                            );
                        }
                    }}
                    onSettingsClick={() => dashboard.setActiveTab('settings')}
                />

                <div className="mt-10">
                    {renderActiveView()}
                </div>
            </main>

            {/* Modals */}
            <PackageModal 
                isOpen={dashboard.isAddingPackage || !!dashboard.editingPackage}
                onClose={() => {
                    dashboard.setIsAddingPackage(false);
                    dashboard.setEditingPackage(null);
                }}
                isAdding={dashboard.isAddingPackage}
                editingPackage={dashboard.editingPackage}
                packageForm={dashboard.packageForm}
                handlePackageFormChange={(e) => dashboard.setPackageForm({...dashboard.packageForm, [e.target.name]: e.target.value})}
                coverPreview={dashboard.coverPreview}
                setCoverPreview={dashboard.setCoverPreview}
                setCoverFile={dashboard.setCoverFile}
                galleryPreviews={dashboard.galleryPreviews}
                setGalleryPreviews={dashboard.setGalleryPreviews}
                deletedGalleryIds={dashboard.deletedGalleryIds}
                setDeletedGalleryIds={dashboard.setDeletedGalleryIds}
                handleCreatePackage={dashboard.handleCreatePackage}
                handleUpdatePackage={dashboard.handleUpdatePackage}
            />

            <AdicionalModal 
                isOpen={dashboard.isAddingAdicional || !!dashboard.editingAdicional}
                onClose={() => {
                    dashboard.setIsAddingAdicional(false);
                    dashboard.setEditingAdicional(null);
                }}
                isAdding={dashboard.isAddingAdicional}
                editingAdicional={dashboard.editingAdicional}
                adicionalForm={dashboard.adicionalForm}
                handleAdicionalFormChange={(e) => dashboard.setAdicionalForm({...dashboard.adicionalForm, [e.target.name]: e.target.value})}
                handleCreateAdicional={dashboard.handleCreateAdicional}
                handleUpdateAdicional={dashboard.handleUpdateAdicional}
            />

            <GalleryUploadModal 
                isOpen={dashboard.isAddingGallery}
                onClose={() => dashboard.setIsAddingGallery(false)}
                handleCreateGallery={dashboard.handleCreateGallery}
            />

            <GalleryEditModal
                isOpen={!!dashboard.editingGallery}
                onClose={() => dashboard.setEditingGallery(null)}
                editingGallery={dashboard.editingGallery}
                handleUpdateGallery={dashboard.handleUpdateGallery}
            />

            {dashboard.editingMenuCategory && (
                <MenuCategoryModal 
                    isOpen={!!dashboard.editingMenuCategory}
                    onClose={() => dashboard.setEditingMenuCategory(null)}
                    category={dashboard.editingMenuCategory}
                    menus={dashboard.menus}
                    fetchData={dashboard.fetchData}
                    handleRenameCategory={dashboard.handleRenameCategory}
                    handleRemoveItem={dashboard.handleRemoveItem}
                />
            )}

            <ReservationModal 
                isOpen={dashboard.isAddingReservation}
                onClose={() => dashboard.setIsAddingReservation(false)}
                clients={dashboard.clients}
                packages={dashboard.packages}
                menus={dashboard.menus}
                adicionales={dashboard.adicionales}
                config={dashboard.configForm}
                reservationForm={dashboard.reservationForm}
                setReservationForm={dashboard.setReservationForm}
                handleCreateReservation={dashboard.handleCreateReservation}
            />

            <ContractModal 
                isOpen={!!dashboard.selectedReservationForContract}
                onClose={() => dashboard.setSelectedReservationForContract(null)}
                selectedReservation={dashboard.selectedReservationForContract}
                contractForm={dashboard.contractForm}
                setContractForm={dashboard.setContractForm}
                handleCreateContract={dashboard.handleCreateContract}
                triggerAlert={dashboard.triggerAlert}
            />

            {dashboard.selectedContractForPayments && (
                <PaymentModal 
                    isOpen={!!dashboard.selectedContractForPayments}
                    onClose={() => dashboard.setSelectedContractForPayments(null)}
                    contract={dashboard.selectedContractForPayments}
                    handleCreatePayment={dashboard.handleCreatePayment}
                />
            )}

            <UserModal
                isOpen={dashboard.isAddingUser}
                onClose={() => dashboard.setIsAddingUser(false)}
                userForm={dashboard.userForm}
                setUserForm={dashboard.setUserForm}
                handleCreateUser={dashboard.handleCreateUser}
            />

            <ConfirmDialog 
                {...dashboard.confirmState} 
                onConfirm={(val) => {
                    if (dashboard.confirmState.onConfirm) dashboard.confirmState.onConfirm(val);
                    dashboard.setConfirmState({ ...dashboard.confirmState, isOpen: false });
                }}
                onCancel={() => dashboard.setConfirmState({ ...dashboard.confirmState, isOpen: false })}
            />
        </div>
    );
};

export default AdminDashboard;
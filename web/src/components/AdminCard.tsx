import React, { useState, useContext } from 'react';
import { Admin, UpdateAdmin } from '../models/Admin';
import { APIContext } from '../context/APIContext';
import DeleteIcon from '../assets/images/Minus-sign.svg';
import LockIcon from '../assets/images/lock-solid.svg';
import CancelIcon from '../assets/images/times-solid.svg';

import '../App.css';
import styles from './AdminCard.module.css';
import { Checkbox } from './Checkbox';

type AdminCardProps = {
  admin: Admin,
  deleteMode: boolean,
  fetchAdmins: () => void,
};

/**
 * Individual Admin Cards with ability to edit and delete admins & permissions
 */
export const AdminCard: React.FC<AdminCardProps> = ({ admin, deleteMode, fetchAdmins }) => {

  const client = useContext(APIContext);

  // states for deleting an admin
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  // delete admin with call to backend
  const handleDelete = async (): Promise<void> => {
    setDeleteModal(false);
    try {
      await client.deleteAdmin(deleteId);
      fetchAdmins();
    } catch (err){
      alert('There was an error deleting admin');
    }
  };

  // diaplay delete confirmation
  const displayDeleteModal = (id: string): void => {
    setDeleteModal(true);
    setDeleteId(id);
  };


  // states for managing an admin
  const [manageModal, setManageModal] = useState(false);
  const [manageId, setManageId] = useState('');

  const [manageAdmins, setManageAdmins] = useState(false);
  const [uploadBooks, setUploadBooks] = useState(false);
  const [editBooks, setEditBooks] = useState(false);
  const [deleteBooks, setDeleteBooks] = useState(false);
  const [accessAnalytics, setAccessAnalytics] = useState(false);
  const [canChat, setCanChat] = useState(false);


  // upload books toggle
  const handleUploadToggle = (): void => {
    setUploadBooks(prevUpload => !prevUpload);
    setEditBooks(false);
    setDeleteBooks(false);
  };

  // display the modal for managing and set the current permissions for the admin
  const displayManageModal = (id: string): void => {
    setManageId(id);
    setManageModal(true);

    setManageAdmins(admin.can_manage_users);
    setUploadBooks(admin.can_upload_books);
    setDeleteBooks(admin.can_delete_books);
    setEditBooks(admin.can_edit_books);
    setAccessAnalytics(admin.can_access_analytics);
    setCanChat(admin.can_chat);
  };

  // update an admin with call to backend
  const handleManage = async (): Promise<void> => {

    setManageModal(false);

    const updatedAdmin: UpdateAdmin = {
      name: admin.name,
      can_manage_users: manageAdmins,
      can_upload_books: uploadBooks,
      can_edit_books: editBooks,
      can_delete_books: deleteBooks,
      can_access_analytics: accessAnalytics,
      can_chat: canChat
    };

    try {
      await client.updateAdmin(manageId, updatedAdmin);
      fetchAdmins();
    } catch (err){
      alert('There was an error updating admin');
    }

  };


  return (

    <div className={styles.container}>


      <div className={styles.adminCard} onClick={() => !deleteMode && !admin.is_primary_admin && displayManageModal(admin.id)} style={deleteMode ? {cursor: 'default'} : {cursor: 'pointer'}}>
        <span className={styles.adminName}>{ admin.name }</span>
        { admin.is_primary_admin ? <span className={styles.primaryAdminName}>(Primary Admin)</span> : null}
      </div>

      {admin.is_primary_admin && deleteMode ? <img className={styles.lockIcon} role="presentation" src={LockIcon} width="20px" height="20px" alt=""/> : null}

      {!admin.is_primary_admin && deleteMode ? <img className={styles.deleteIcon} role="presentation" src={DeleteIcon} width="20px" height="20px" alt="" onClick={() => displayDeleteModal(admin.id)}/> : null}


      {deleteModal &&
        (
          <div className={styles.modal}>
            <div className={styles.modalContentDelete}>

              <form>
                <p className={styles.modalTitleDelete}>Are you sure you want to delete this account?</p>
                <div className={styles.buttonsContainer}>
                  <button className={styles.cancelButton} type="button" onClick={() => setDeleteModal(false)}>Cancel</button>
                  <button className={styles.deleteConfirmButton} type="button" onClick={handleDelete}>Delete</button>
                </div>
              </form>

            </div>
          </div>
        )
      }


      { manageModal &&
        (
          <div className={styles.modal}>
            <div className={styles.modalContentManage}>

              <form>

                <div className={styles.titleAndCancelBtn}>
                  <p className={styles.modalTitleManage}>Manage Account</p>

                  <button className={styles.exitButton} type="button" onClick={() => setManageModal(false)}>
                    <img className={styles.cancelIcon} src={CancelIcon}/>
                  </button>
                </div>

                <p className={styles.modalTextManage}>(Check the boxes to grant this account specific access)</p>

                <div className={styles.manageContainer}>
                  <div className={styles.spacing}/>

                  <div className={styles.allCheckboxesContainer}>

                    <Checkbox className={styles.checkbox} label="Manage" id="manageBox" onChange={() => setManageAdmins(prevManage => !prevManage)} checked={manageAdmins} />
                    <Checkbox className={styles.checkbox} label="Analytics" id="analyticsBox" onChange={() => setAccessAnalytics(prevAccess => !prevAccess)} checked={accessAnalytics} />
                    <Checkbox className={styles.checkbox} label="Chat" id="chatBox" onChange={() => setCanChat(prevChat => !prevChat)} checked={canChat} />
                    <Checkbox className={styles.checkbox} label="Upload Books" id="uploadBooksBox" onChange={handleUploadToggle} checked={uploadBooks} />

                    {uploadBooks ? (
                      <>
                        <Checkbox className={styles.checkbox} label="&mdash; Edit Books" id="editBooksBox" onChange={() => setEditBooks(prevEdit => !prevEdit)} checked={editBooks} />
                        <Checkbox className={styles.checkbox} label="&mdash; Delete Books" id="deleteBooksBox" onChange={() => setDeleteBooks(prevDelete => !prevDelete)} checked={deleteBooks} />
                      </>
                    ) : null}

                  </div>
                </div>

                <div className={styles.confirmContainer}>
                  <button className={styles.deleteConfirmButton} type="button" onClick={handleManage}>Confirm</button>
                </div>

              </form>

            </div>
          </div>
        )
      }

    </div>
  );
};

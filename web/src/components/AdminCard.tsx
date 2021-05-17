import React, { useState, useContext } from 'react';
import { Admin, UpdateAdmin } from '../models/Admin';
import { APIContext } from '../context/APIContext';
import DeleteIcon from '../assets/images/Minus-sign.svg';
import LockIcon from '../assets/images/lock-solid.svg';

import '../App.css';
import styles from './AdminCard.module.css';

type AdminCardProps = {
  admin: Admin,
  deleteMode: boolean,
  fetchAdmins: () => void,
};

export const AdminCard: React.FC<AdminCardProps> = ({ admin, deleteMode, fetchAdmins }) => {

  const client = useContext(APIContext);

  // states for deleting an admin
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  const handleDelete = async (): Promise<void> => {
    setDeleteModal(false);
    await client.deleteAdmin(deleteId);
    fetchAdmins();
  };

  const displayDeleteModal = (id: string): void => {
    setDeleteModal(true);
    setDeleteId(id);
  };


  // states for managing an admin
  const [manageModal, setManageModal] = useState(false);
  const [manageId, setManageId] = useState('');

  // states for managing an admin
  const [manageAdmins, setManageAdmins] = useState(false);
  const [uploadBooks, setUploadBooks] = useState(false);
  const [editBooks, setEditBooks] = useState(false);
  const [deleteBooks, setDeleteBooks] = useState(false);


  // upload books toggle
  const handleUploadToggle = (): void => {
    setUploadBooks(prevUpload => !prevUpload);
    setEditBooks(false);
    setDeleteBooks(false);
  };

  // diplay the modal for managing and set the current permissions for the admin
  const displayManageModal = (id: string): void => {
    setManageId(id);
    setManageModal(true);

    setManageAdmins(admin.can_manage_users);
    setUploadBooks(admin.can_upload_books);
    setDeleteBooks(admin.can_delete_books);
    setEditBooks(admin.can_edit_books);
  };


  const handleManage = async (): Promise<void> => {

    setManageModal(false);

    const updatedAdmin: UpdateAdmin = {
      name: admin.name,
      can_manage_users: manageAdmins,
      can_upload_books: uploadBooks,
      can_edit_books: editBooks,
      can_delete_books: deleteBooks,
    };

    await client.updateAdmin(manageId, updatedAdmin);
    fetchAdmins();
  };


  return (
    <div className={styles.container}>

      <div className={styles.adminCard} onClick={() => !deleteMode && !admin.is_primary_admin && displayManageModal(admin.id)} style={deleteMode ? {cursor: 'default'} : {cursor: 'pointer'}}>
        <span className={styles.adminName}>{ admin.name }</span>
        { admin.is_primary_admin && <span className="body3">(Primary Admin)</span> }
      </div>
      
      {admin.is_primary_admin && deleteMode && <img className={styles.lockIcon} role="presentation" src={LockIcon} width="20px" height="20px" alt=""/> }
      
      {!admin.is_primary_admin && deleteMode && <img className={styles.deleteIcon} role="presentation" src={DeleteIcon} width="20px" height="20px" alt="" onClick={() => displayDeleteModal(admin.id)}/>}
      

      {deleteModal && 
        (
          <div className={styles.modal}>
            <div className={styles.modalContentDelete}>    
              <form>
                <div>
                  <p className={styles.modalTitleDelete}>Are you sure you want to delete this account?</p>
                  <div className={styles.buttonsContainer}>
                    <button className={styles.cancelButton} type="button" onClick={() => setDeleteModal(false)}>Cancel</button>
                    <button className={styles.deleteButton} type="button" onClick={handleDelete}>Delete</button>
                  </div>
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
                <div>

                  <p className={styles.modalTitleManage}>Manage Account</p>
                  <p className={styles.modalTextManage}>(Check the boxes to grant this account specific access)</p>

                  <label htmlFor="manage">Manage</label>
                  <input type="checkbox" id="manageBox" onChange={() => setManageAdmins(prevManage => !prevManage)} checked={manageAdmins}/>

                  <label htmlFor="uploadBooks">Upload Books</label>
                  <input type="checkbox" id="uploadBooksBox" onChange={handleUploadToggle} checked={uploadBooks}/>

                  {uploadBooks && 
                    (
                      <div>                   
                        <label htmlFor="deleteBooks">Delete Books</label>
                        <input type="checkbox" id="deleteBooksBox" onChange={() => setDeleteBooks(prevDelete => !prevDelete)} checked={deleteBooks}/>
                      
                        <label htmlFor="editBooks">Edit Books</label>
                        <input type="checkbox" id="editBooksBox" onChange={() => setEditBooks(prevEdit => !prevEdit)} checked={editBooks}/>
                      </div>
                    )
                  }

                  <div className={styles.buttonsContainer}>
                    <button className={styles.cancelButton} type="button" onClick={() => {setManageModal(false);}}>Cancel</button>
                    <button className={styles.deleteButton} type="button" onClick={handleManage}>Confirm</button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        )
      }
      
    </div>
  );
};
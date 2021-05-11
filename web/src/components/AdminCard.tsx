import React, { useState } from 'react';
import { Admin, CreateAdmin, UpdateAdmin } from '../models/Admin';
import DeleteIcon from '../assets/images/Minus-sign.svg';
import LockIcon from '../assets/images/lock-solid.svg';

import '../App.css';
import styles from './AdminCard.module.css';

type AdminCardProps = {
  admin: Admin,
  deleteMode: boolean,
  onDelete: (id: string) => void,
  // manageMode: boolean,
  // onManage: (id: string) => void,
};

export const AdminCard: React.FC<AdminCardProps> = ({ admin, deleteMode, onDelete }) => {

  // states for managing an admin
  const [manageModal, setManageModal] = useState(false);
  const [manageId, setManageId] = useState('');

  // states for managing an admin
  const [manageAdmins, setManageAdmins] = useState(false);
  const [uploadBooks, setUploadBooks] = useState(false);
  const [editBooks, setEditBooks] = useState(false);
  const [deleteBooks, setDeleteBooks] = useState(false);

  console.log("Manage", manageAdmins);
  console.log("Upload", uploadBooks);
  console.log("Edit", editBooks);
  console.log("Delete", deleteBooks);
  console.log("----------------");

  // when upload books is unchecked, set edit & delete books to false
  const handleUploadToggle = (): void => {
    if (manageAdmins) {
      setUploadBooks(prevUpload => !prevUpload);
      setEditBooks(false);
      setDeleteBooks(false);
    } else {
      setUploadBooks(prevUpload => !prevUpload);
    }
  };

  // reset all checkboxes
  const resetOptions = (): void => {
    setManageAdmins(false);
    setUploadBooks(false);
    setEditBooks(false);
    setDeleteBooks(false);
  };

  const displayManageModal = (id: string): void => {
    setManageId(id);
    setManageModal(true);
  };

  const handleManage = async (): Promise<void> => {
    resetOptions();
    setManageModal(false);
    // await client.updateAdmin(manageId);
    // setAdmins(); ?
  };


  return (
    <div className={styles.container}>

      <div className={styles.adminCard} onClick={() => !deleteMode && !admin.is_primary_admin && displayManageModal(admin.id)} style={deleteMode ? {cursor: 'default'} : {cursor: 'pointer'}}>
        <span className={styles.adminName}>{ admin.name }</span>
        { admin.is_primary_admin && <span className="body3">(Primary Admin)</span> }
      </div>
      
      {admin.is_primary_admin && deleteMode && <img className={styles.lockIcon} role="presentation" src={LockIcon} width="20px" height="20px" alt=""/> }
      
      {!admin.is_primary_admin && deleteMode && <img className={styles.deleteIcon} role="presentation" src={DeleteIcon} width="20px" height="20px" alt="" onClick={() => onDelete(admin.id)}/>}
      

      { manageModal &&
        (
          <div className={styles.modal}>
            <div className={styles.modalContentManage}>    
              <form>
                <div>

                  <p className={styles.modalTitleManage}>Manage Account</p>
                  <p className={styles.modalTextManage}>(Check the boxes to grant this account specific access)</p>

                  <label htmlFor="manage">Manage</label>
                  <input type="checkbox" id="manageBox" onChange={() => setManageAdmins(prevManage => !prevManage)}></input>

                  <label htmlFor="uploadBooks">Upload Books</label>
                  <input type="checkbox" id="uploadBooksBox" onChange={handleUploadToggle}></input>

                  {uploadBooks && 
                    (
                      <div>
                        <label htmlFor="editBooks">Edit Books</label>
                        <input type="checkbox" id="editBooksBox" onChange={() => setEditBooks(prevEdit => !prevEdit)}></input>

                        <label htmlFor="deleteBooks">Delete Books</label>
                        <input type="checkbox" id="deleteBooksBox" onChange={() => setDeleteBooks(prevDelete => !prevDelete)}></input>

                      </div>

                    )
                  }

                  <div className={styles.buttonsContainer}>
                    <button className={styles.cancelButton} type="button" onClick={() => {resetOptions(); setManageModal(false);}}>Cancel</button>
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
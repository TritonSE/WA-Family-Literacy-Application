import React, { useContext, useEffect, useState } from 'react';
import { AdminCard } from '../components/AdminCard';
import { APIContext } from '../context/APIContext';
import { Admin, CreateAdmin } from '../models/Admin';
import AddIcon from '../assets/images/plus-circle-solid-green.svg';
import CancelIcon from '../assets/images/times-solid.svg';

import '../App.css';
import styles from './ManageAccountsPage.module.css';

/**
 * Admin Manage Accounts page with Admin Cards and ability to add new admins
 */
export const ManageAccountsPage: React.FC = () => {

  const client = useContext(APIContext);

  // list of admins 
  const [admins, setAdmins] = useState<Admin[]>([]);

  // get admins from backend
  const fetchAdmins = async (): Promise<void> => {
    try {
      const res = await client.getAdmins();
      const primaryAdmin: Admin[] = res.filter(a => a.is_primary_admin);
      const otherAdmins: Admin[] = res.filter(a => !a.is_primary_admin);
      const adminList: Admin[] =  [...primaryAdmin, ...otherAdmins];
      setAdmins(adminList);
    } catch (err) {
      alert('There was an error getting admins');
    }
  };

  // get admins on first load
  useEffect(()=> {
    fetchAdmins();
  },[]);


  // if delete mode is active
  const [deleteMode, setDeleteMode] = useState(false);

  // states for new account
  const [newModal, setNewModal] = useState(false);

  const [volunteerName, setVolunteerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  
  const [manageAdmins, setManageAdmins] = useState(false);
  const [uploadBooks, setUploadBooks] = useState(false);
  const [editBooks, setEditBooks] = useState(false);
  const [deleteBooks, setDeleteBooks] = useState(false);

  // new admin with call to backend
  const handleNewAccount = async (): Promise<void> => {

    // if any fields are empty or the passwords don't match, alert 
    if (volunteerName.length === 0 || email.length === 0 || password.length === 0 || reenterPassword.length === 0){
      alert('Please fill in all fields');
    } else if (password !== reenterPassword) {
      alert('Passwords must match');
    } else {
      
      setNewModal(false);

      const newAdmin: CreateAdmin = {
        name: volunteerName,
        email: email,
        password: password,
        can_manage_users: manageAdmins,
        can_upload_books: uploadBooks,
        can_edit_books: editBooks,
        can_delete_books: deleteBooks,
      };

      try {
        await client.createAdmin(newAdmin);
        fetchAdmins();
      } catch (err){
        alert('There was an error adding admin');
      }
      clearOptions();
    
    }

  };

  // clear the checkboxes
  const clearOptions = (): void => {
    setVolunteerName('');
    setEmail('');
    setPassword('');
    setReenterPassword('');

    setManageAdmins(false);
    setUploadBooks(false);
    setEditBooks(false);
    setDeleteBooks(false);
  };

  // upload books toggle
  const handleUploadToggle = (): void => {
    setUploadBooks(prevUpload => !prevUpload);
    setEditBooks(false);
    setDeleteBooks(false);
  };

  
  return (

    <div>


      <div className={styles.row}>
        <p className={styles.title}>Manage Accounts</p>

        <button type="button" onClick={() => setDeleteMode(prevMode => !prevMode)} className={styles.clickableText}>
          {deleteMode ? 'Done': 'Delete Account'}
        </button>
      </div>


      <div className={styles.admins}>
        { admins.map((admin) => (
          <AdminCard key={admin.id} admin={admin} deleteMode={deleteMode} fetchAdmins={fetchAdmins}/>
        ))
        }
      </div>


      <div>
        <button className={styles.addButton} onClick={() => !deleteMode && setNewModal(true)} style={deleteMode ? {cursor: 'default'} : {cursor: 'pointer'}}>
          <p className={styles.addText}>New Account</p>
          <img className={styles.addIcon} src={AddIcon} alt='' />
        </button>
      </div>


      {newModal &&
        (
          <div className={styles.modal}>
            <div className={styles.modalContentAdd}>    
              <form>

                <div className={styles.titleAndCancelBtn}>
                  <p className={styles.modalTitleAdd}>New Account</p>

                  <button className={styles.cancelButton} type="button" onClick={() => {setNewModal(false); clearOptions();}}>
                    <img className={styles.cancelIcon} src={CancelIcon}/>
                  </button>
                </div>

                <div className={styles.addContent}>
                  
                  <div className={styles.volunteerInfo}>
                    <p className="h3">Volunteer Name</p>
                    <input type="text" id="nameBox" value={volunteerName} className={styles.inputBox} onChange={(e) => setVolunteerName(e.target.value)}/>

                    <p className="h3">Email</p>
                    <input type="text" id="emailBox" value={email} className={styles.inputBox} onChange={(e) => setEmail(e.target.value)}/>

                    <p className="h3">Password</p>
                    <input type="password" id="passwordBox" value={password} className={styles.inputBox} onChange={(e) => setPassword(e.target.value)}/>

                    <p className="h3">Re-enter Password</p>
                    <input type="password" id="reenterBox" value={reenterPassword} className={styles.inputBox} onChange={(e) => setReenterPassword(e.target.value)}/>
                  </div>

                  <div className={styles.access}>
                    <p className={styles.accessTitle}>Access</p>

                    <div className={styles.allCheckboxesContainer}>

                      <label className={styles.checkboxContainer} htmlFor="manageBox">
                        Manage
                        <input type="checkbox" id="manageBox" onChange={() => setManageAdmins(prevManage => !prevManage)} checked={manageAdmins}/>
                        <span className={styles.checkmark}></span>
                        <br/>
                      </label>
                      <label className={styles.checkboxContainer} htmlFor="uploadBooksBox">
                        Upload Books
                        <input type="checkbox" id="uploadBooksBox" onChange={handleUploadToggle} checked={uploadBooks}/>
                        <span className={styles.checkmark}></span>
                        <br/>
                      </label>

                      {uploadBooks && 
                        (
                          <>
                            <label className={styles.checkboxContainer} htmlFor="editBooksBox">
                              &mdash; Edit Books
                              <input type="checkbox" id="editBooksBox" onChange={() => setEditBooks(prevEdit => !prevEdit)} checked={editBooks}/>
                              <span className={styles.checkmark}></span>
                              <br/>
                            </label>
                            <label className={styles.checkboxContainer} htmlFor="deleteBooksBox">
                              &mdash; Delete Books
                              <input type="checkbox" id="deleteBooksBox" onChange={() => setDeleteBooks(prevDelete => !prevDelete)} checked={deleteBooks}/>
                              <span className={styles.checkmark}></span>
                              <br/>
                            </label>              
                          </>                         
                        )
                      }
                    
                    </div>

                  </div>

                </div>

                <div className={styles.buttonsContainer}>
                  <button className={styles.deleteConfirmButton} type="button" onClick={handleNewAccount}>Confirm</button>
                </div>
                
              </form>
            </div>
          </div>

        )
      }


    </div>

  );


};


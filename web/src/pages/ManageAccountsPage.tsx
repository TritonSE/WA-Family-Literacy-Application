import React, { useContext, useEffect, useState } from 'react';
import { AdminCard } from '../components/AdminCard';
import { APIContext } from '../context/APIContext';
import { Admin, CreateAdmin } from '../models/Admin';
import AddIcon from '../assets/images/plus-circle-solid-green.svg';

import '../App.css';
import styles from './ManageAccountsPage.module.css';


export const ManageAccountsPage: React.FC = () => {

  const client = useContext(APIContext);


  // list of admins 
  const [admins, setAdmins] = useState<Admin[]>([]);

  // get admins from backend
  const fetchAdmins = async (): Promise<void> => {
    const res = await client.getAdmins();

    const primaryAdmin: Admin[] = res.filter(a => a.is_primary_admin);
    const otherAdmins: Admin[] = res.filter(a => !a.is_primary_admin);

    const adminList: Admin[] =  [...primaryAdmin, ...otherAdmins];
    setAdmins(adminList);

  };


  useEffect(()=> {

    fetchAdmins();

    const test: Admin[] = [
      {
        id: '1',
        name: 'RobertBob Jacobson HenryJerry',
        email: 'bob@gmail.com',
        can_manage_users: true,
        can_upload_books: true,
        can_delete_books: true,
        can_edit_books: true,
        is_primary_admin: false,
      },
      {
        id: '2',
        name: 'Joseph Robert Downey Jr. Jacobs Tom III BOb ',
        email: 'joe@gmail.com',
        can_manage_users: true,
        can_upload_books: true,
        can_delete_books: true,
        can_edit_books: false,
        is_primary_admin: true,
      },
      {
        id: '3333333333333333333',
        name: 'Alice',
        email: 'alice@gmail.com',
        can_manage_users: true,
        can_upload_books: false,
        can_delete_books: false,
        can_edit_books: false,
        is_primary_admin: false,
      },
      {
        id: '4',
        name: 'Olivia',
        email: 'olivia@gmail.com',
        can_manage_users: false,
        can_upload_books: false,
        can_delete_books: false,
        can_edit_books: false,
        is_primary_admin: false,
      },
      {
        id: '5',
        name: 'John',
        email: 'olivia@gmail.com',
        can_manage_users: true,
        can_upload_books: true,
        can_delete_books: false,
        can_edit_books: false,
        is_primary_admin: false,
      },
      {
        id: '6',
        name: 'Jim',
        email: 'olivia@gmail.com',
        can_manage_users: false,
        can_upload_books: false,
        can_delete_books: false,
        can_edit_books: false,
        is_primary_admin: false,
      },
      {
        id: '7',
        name: 'Emma',
        email: 'olivia@gmail.com',
        can_manage_users: true,
        can_upload_books: true,
        can_delete_books: true,
        can_edit_books: false,
        is_primary_admin: false,
      }
    ];

  },[]);


  // if delete mode is active
  const [deleteMode, setDeleteMode] = useState(false);

  // states for new account
  const [newModal, setNewModal] = useState(false);

  const [volunteerName, setVolunteerName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  
  const [manageAdmins, setManageAdmins] = useState(false);
  const [uploadBooks, setUploadBooks] = useState(false);

  const handleNewAccount = async (): Promise<void> => {
    setNewModal(false);

    // console.log(volunteerName);
    // console.log(username);
    // console.log(password);
    // console.log(reenterPassword);
    // console.log(manageAdmins);
    // console.log(uploadBooks);

    const newAdmin: CreateAdmin = {
      name: volunteerName,
      email: username,
      password: password,
      can_manage_users: manageAdmins,
      can_upload_books: uploadBooks,
      can_edit_books: false,
      can_delete_books: false,
    };

    console.log(newAdmin);

    await client.createAdmin(newAdmin);
    fetchAdmins();

    setVolunteerName('');
    setUsername('');
    setPassword('');
    setReenterPassword('');

    setManageAdmins(false);
    setUploadBooks(false);

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

                <div>

                  <p className={styles.modalTitleAdd}>New Account</p>
                  <div className={styles.addContent}>
                    
                    <div>
                      <form className={styles.volunteerInfo}>
                        <p className="h3">Volunteer Name</p>
                        <input type="text" id="nameBox" value={volunteerName} onChange={(e) => setVolunteerName(e.target.value)}/>

                        <p className="h3">Username (Email)</p>
                        <input type="text" id="usernameBox" value={username} onChange={(e) => setUsername(e.target.value)}/>

                        <p className="h3">Password</p>
                        <input type="text" id="passwordBox" value={password} onChange={(e) => setPassword(e.target.value)}/>

                        <p className="h3">Re-enter Password</p>
                        <input type="text" id="reenterBox" value={reenterPassword} onChange={(e) => setReenterPassword(e.target.value)}/>
                      </form>
                    </div>

                    <div className={styles.access}>
                      <p className="h3">Access</p>

                      <label htmlFor="manage">Manage</label>
                      <input type="checkbox" id="manageBox" onChange={() => setManageAdmins(prevManage => !prevManage)} checked={manageAdmins}/>
                      <br/>
                      <label htmlFor="uploadBooks">Upload Books</label>
                      <input type="checkbox" id="uploadBooksBox" onChange={() => setUploadBooks(prevManage => !prevManage)} checked={uploadBooks}/>

                      {/* <label htmlFor="deleteBooks">Delete Books</label>
                      <input type="checkbox" id="deleteBooksBox"/>
                
                      <label htmlFor="editBooks">Edit Books</label>
                      <input type="checkbox" id="editBooksBox"/> */}
                    </div>

                  </div>

                  <div className={styles.buttonsContainer}>
                    <button className={styles.cancelButton} type="button" onClick={() => setNewModal(false)}>Cancel</button>
                    <button className={styles.deleteButton} type="button" onClick={handleNewAccount}>Confirm</button>
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

import React, { useContext, useEffect, useState } from 'react';
import { AdminCard } from '../components/AdminCard';
import { APIContext } from '../context/APIContext';
import { Admin, CreateAdmin } from '../models/Admin';
import AddIcon from '../assets/images/plus-circle-solid-green.svg';

import '../App.css';
import styles from './ManageAccountsPage.module.css';


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
    // setAdmins(test);
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

      await client.createAdmin(newAdmin).catch(() => alert('There was an error adding admin'));
      fetchAdmins();
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

                <div>

                  <p className={styles.modalTitleAdd}>New Account</p>
                  <div className={styles.addContent}>
                    
                    <div>
                      <div className={styles.volunteerInfo}>
                        <p className="h3">Volunteer Name</p>
                        <input type="text" id="nameBox" value={volunteerName} onChange={(e) => setVolunteerName(e.target.value)}/>

                        <p className="h3">Email</p>
                        <input type="text" id="emailBox" value={email} onChange={(e) => setEmail(e.target.value)}/>

                        <p className="h3">Password</p>
                        <input type="text" id="passwordBox" value={password} onChange={(e) => setPassword(e.target.value)}/>

                        <p className="h3">Re-enter Password</p>
                        <input type="text" id="reenterBox" value={reenterPassword} onChange={(e) => setReenterPassword(e.target.value)}/>
                      </div>
                    </div>

                    <div className={styles.access}>
                      <p className="h3">Access</p>

                      <div className={styles.checkboxContainer}>

                        <label htmlFor="manage">Manage</label>
                        <input type="checkbox" id="manageBox" onChange={() => setManageAdmins(prevManage => !prevManage)} checked={manageAdmins}/>

                        <label htmlFor="uploadBooks">Upload Books</label>
                        <input type="checkbox" id="uploadBooksBox" onChange={handleUploadToggle} checked={uploadBooks}/>

                        {uploadBooks && 
                          (
                            <div>                   
                              <label htmlFor="deleteBooks">Delete Books</label>
                              <input type="checkbox" id="deleteBooksBox" onChange={() => setDeleteBooks(prevDelete => !prevDelete)} checked={deleteBooks}/>
                              <br/>
                              <label htmlFor="editBooks">Edit Books</label>
                              <input type="checkbox" id="editBooksBox" onChange={() => setEditBooks(prevEdit => !prevEdit)} checked={editBooks}/>
                            </div>
                          )
                        }
                      
                      </div>


                    </div>

                  </div>

                  <div className={styles.buttonsContainer}>
                    <button className={styles.cancelButton} type="button" onClick={() => {setNewModal(false); clearOptions();}}>Cancel</button>
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

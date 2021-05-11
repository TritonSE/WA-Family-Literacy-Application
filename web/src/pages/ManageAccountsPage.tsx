import React, { useContext, useEffect, useState } from 'react';
import { AdminCard } from '../components/AdminCard';
import { APIContext } from '../context/APIContext';
import { Admin } from '../models/Admin';
import AddIcon from '../assets/images/plus-circle-solid-green.svg';

import '../App.css';
import styles from './ManageAccountsPage.module.css';


export const ManageAccountsPage: React.FC = () => {


  const [admins, setAdmins] = useState<Admin[]>([]);

  const [deleteMode, setDeleteMode] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState('');


  const client = useContext(APIContext);

  useEffect(()=> {
    (async () => {
      const res = await client.getAdmins();
      setAdmins(res);
    });

    const test: Admin[] = [
      {
        id: '1',
        name: 'RobertBob Jacobson HenryJerry',
        email: 'bob@gmail.com',
        can_delete_books: true,
        can_manage_users: true,
        can_upload_books: true,
        is_primary_admin: false,
      },
      {
        id: '2',
        name: 'Joseph Robert Downey Jr.',
        email: 'joe@gmail.com',
        can_delete_books: true,
        can_manage_users: true,
        can_upload_books: true,
        is_primary_admin: true,
      },
      {
        id: '3333333333333333333',
        name: 'Alice',
        email: 'alice@gmail.com',
        can_delete_books: true,
        can_manage_users: true,
        can_upload_books: true,
        is_primary_admin: false,
      },
      {
        id: '4',
        name: 'Olivia',
        email: 'olivia@gmail.com',
        can_delete_books: true,
        can_manage_users: true,
        can_upload_books: true,
        is_primary_admin: false,
      },
      {
        id: '5',
        name: 'John',
        email: 'olivia@gmail.com',
        can_delete_books: true,
        can_manage_users: true,
        can_upload_books: true,
        is_primary_admin: false,
      },
      {
        id: '6',
        name: 'Jim',
        email: 'olivia@gmail.com',
        can_delete_books: true,
        can_manage_users: true,
        can_upload_books: true,
        is_primary_admin: false,
      },
      {
        id: '7',
        name: 'Emma',
        email: 'olivia@gmail.com',
        can_delete_books: true,
        can_manage_users: true,
        can_upload_books: true,
        is_primary_admin: false,
      }
    ];
  
    const primaryAdmin = test.find(a => a.is_primary_admin);
    const temp = test.filter(a => !a.is_primary_admin);
  
    if (primaryAdmin) {
      setAdmins([primaryAdmin, ...temp]);
    } else {
      setAdmins(test);
    }

  },[]);


  const displayDeleteModal = (id: string): void => {
    setDeleteModal(true);
    setDeleteId(id);
  };

  const handleDelete = async (): Promise<void> => {
    setDeleteModal(false);
    // await client.deleteAdmin(deleteId);
    setAdmins(prevAdmins => prevAdmins.filter(a => a.id != deleteId));
  };


  console.log(admins);

  
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
          <AdminCard key={admin.id} admin={admin} deleteMode={deleteMode} onDelete={displayDeleteModal}/>
        ))
        }
      </div>


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


      <div>
        <button className={styles.addButton} onClick={() => !deleteMode && alert("clicked")} style={deleteMode ? {cursor: 'default'} : {cursor: 'pointer'}}>
          <p className={styles.addText}>New Account</p>
          <img className={styles.addIcon} src={AddIcon} alt='' />
        </button>
      </div>


    </div>

  );


};

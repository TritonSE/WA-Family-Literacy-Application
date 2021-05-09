import React, { useContext, useEffect, useState } from 'react';
import { AdminCard } from '../components/AdminCard';
import { APIContext } from '../context/APIContext';
import { Admin } from '../models/Admin';

import './ManagePage.css';

export const ManagePage: React.FC = () => {


  const [admins, setAdmins] = useState<Admin[]>([]);

  const [deleteMode, setDeleteMode] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
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
        name: 'BobBobBobBobBobBobBobBobBobBobBob',
        email: 'bob@gmail.com',
        can_delete_books: true,
        can_manage_users: true,
        can_upload_books: true,
        is_primary_admin: false,
      },
      {
        id: '2',
        name: 'Joe',
        email: 'joe@gmail.com',
        can_delete_books: true,
        can_manage_users: true,
        can_upload_books: true,
        is_primary_admin: true,
      },
      {
        id: '3',
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


  const displayModal = (id: string): void => {
    setConfirmationModal(true);
    setDeleteId(id);
  };

  const handleDelete = async (): Promise<void> => {
    setConfirmationModal(false);
    // await client.deleteAdmin(deleteId);
    setAdmins(prevAdmins => prevAdmins.filter(a => a.id != deleteId));
  };

  console.log(admins);

  
  return (

    <div>


      <div className="row">

        <p className="title h2">Manage Accounts</p>

        <button type="button" onClick={() => setDeleteMode(prevMode => !prevMode)} className="clickableText body3">
          {deleteMode ? 'Done': 'Delete Account'}
        </button>

      </div>


      <div className="admins"> 
        { admins.map((admin) => (
          <AdminCard key={admin.id} admin={admin} deleteMode={deleteMode} onDelete={displayModal}/>
        ))
        }
      </div>

      {confirmationModal && 
        (
          <div className="modal">
            <div className="modalContent">    

              <form>

                <div>
                  <p className="h3 modalTitle">Are you sure you want to delete this account?</p>
                  <div className="buttonsContainer">
                    <button className="cancelBtn body3" type="button" onClick={() => { setConfirmationModal(false); }}>Cancel</button>
                    <button className="deleteBtn body3" type="button" onClick={handleDelete}>Delete</button>
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

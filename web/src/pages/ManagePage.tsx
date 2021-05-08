import React, { useContext, useEffect, useState } from 'react';
import { AdminCard } from '../components/AdminCard';
import { APIContext } from '../context/APIContext';
import { Admin } from '../models/Admin';

import './ManagePage.css';

export const ManagePage: React.FC = () => {


  const [admins, setAdmins] = useState<Admin[]>([]);

  const [deleteMode, setDeleteMode] = useState(false);

  const client = useContext(APIContext);

  useEffect(()=> {
    // (async () => {
    //   const res = await client.getAdmins();
    //   setAdmins(res);
    // });

    const test: Admin[] = [
      {
        id: '1',
        name: 'Bob',
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
        is_primary_admin: false,
      },
      {
        id: '3',
        name: 'Alice',
        email: 'alice@gmail.com',
        can_delete_books: true,
        can_manage_users: true,
        can_upload_books: true,
        is_primary_admin: false,
      }
    ];
  
    setAdmins(test);


  },[]);

  // useEffect(() => {
  //   const primaryAdmin = admins.find(a => a.is_primary_admin);
  //   const temp = admins.filter(a => !a.is_primary_admin);

  //   if (primaryAdmin) {
  //     setAdmins([primaryAdmin, ...temp]);
  //   }
  // }, [admins]);

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
          <AdminCard key={admin.id} admin={admin} deleteMode={deleteMode}/>
        ))
        }
      </div>


    </div>

  );


};

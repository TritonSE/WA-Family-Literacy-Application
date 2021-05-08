import React, { useContext, useEffect, useState } from 'react';
import { APIContext } from '../context/APIContext';
import { Admin } from '../models/Admin';

import './ManagePage.css';

export const ManagePage: React.FC = () => {


  const [admins, setAdmins] = useState<Admin[]>([]);

  const [deleteMode, setDeleteMode] = useState(false);

  const client = useContext(APIContext);

  useEffect(()=> {
    (async () => {
      const res = await client.getAdmins();
      setAdmins(res);
    });
  },[]);

  useEffect(() => {
    const primaryAdmin = admins.find(a => a.is_primary_admin);
    const temp = admins.filter(a => !a.is_primary_admin);

    if (primaryAdmin) {
      setAdmins([primaryAdmin, ...temp]);
    }
  }, [admins]);

  console.log(admins);

  return (

    <div>

      <div className="row">

        <p className="title h2">Manage Accounts</p>

        <button type="button" onClick={() => setDeleteMode(prevMode => !prevMode)} className="clickableText body3">
          {deleteMode ? 'Done': 'Delete Account'}
        </button>

      </div>


    </div>

  );


};

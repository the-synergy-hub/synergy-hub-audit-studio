import {openDatabase,migrate} from '../lib/db.mjs';const db=await openDatabase();try{await migrate(db);console.log('Database schema is ready.')}finally{await db.end()}

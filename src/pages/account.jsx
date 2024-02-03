//protected route example

import React from 'react';

import { useSession, signIn, signOut,getSession } from 'next-auth/react';

const account = () => {
    const{data:session}=useSession({required:true})//this will ensure that endpoint is not accessible at all

    console.log(session)
    if (session)
    {
        return(
            <div>
                <p>
                    
                Welcome {session.user.name}
                </p>
                <button onClick={()=>signOut()}>Sign Out</button>
            </div>
        )
    }
    return (
        <div>
            <p>
                You are not signed in
            </p>
        </div>
    )
}

export default account;

export const getServerSideProps=async(context)=>{

    const session=await getSession(context)
    if (!session)
    {
        return {
            redirect:{
                destination:'/login',
            }
        }
    }
    return{
        props:{
            session
        },
    }
}
import { handleSignOut } from '@/helpers/cognito-actions';
import React from 'react';

const SignOutButton: React.FC = () => {
    const onSignOut = async () => {
        await handleSignOut();
    };
    return (
        <button onClick={onSignOut}>
            Sign Out
        </button>
    );
};

export default SignOutButton;
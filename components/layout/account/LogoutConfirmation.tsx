import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/SessionContext';
import { URL_LOGIN } from '../../../data/urlConstants';
import { toLink } from '../../../lib/util';

export interface ConfirmationDialogRawProps {
    id: string;
    keepMounted: boolean;
    open: boolean;
    onClose: () => void;
}

function LogoutConfirmation(props: ConfirmationDialogRawProps) {
    const { onClose, open, ...other } = props;
    const { deleteAuthToken } = useAuth();
    const router = useRouter();

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose();
        deleteAuthToken();
        router.replace(toLink(URL_LOGIN));
    };

    return (
        <Dialog
            sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
            maxWidth="xs"
            open={open}
            {...other}
        >
            <DialogTitle>Do you really want to log out?</DialogTitle>
            <DialogActions>
                <Button autoFocus onClick={handleCancel}>
                    Cancel
                </Button>
                <Button onClick={handleOk}>Logout</Button>
            </DialogActions>
        </Dialog>
    );
}

export default LogoutConfirmation
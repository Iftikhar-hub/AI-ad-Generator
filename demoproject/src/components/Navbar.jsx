import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

export default function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar style={{ display: 'flex', gap: '10px', backgroundColor: '#313647' }}>
                <Button color="inherit" component={Link} to="/">Home</Button>
                <Button color="inherit" component={Link} to="/login">Login</Button>
                <Button color="inherit" component={Link} to="/signup">Sign Up</Button>
                <Button color="inherit" component={Link} to="/profile">Profile</Button>
            </Toolbar>
        </AppBar>
    );
}

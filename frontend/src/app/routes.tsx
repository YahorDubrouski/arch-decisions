import {Route, Routes} from 'react-router-dom';
import {HomePage} from '@/pages/HomePage';
import {ContextBuilderPage} from '@/pages/ContextBuilderPage';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/context" element={<ContextBuilderPage/>}/>
        </Routes>
    );
}

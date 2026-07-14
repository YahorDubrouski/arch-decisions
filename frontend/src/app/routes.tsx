import {Route, Routes} from 'react-router-dom';
import {HomePage} from '@/pages/HomePage';
import {ContextBuilderPage} from '@/pages/ContextBuilderPage';
import {DecisionsPage} from '@/pages/DecisionsPage';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/context" element={<ContextBuilderPage/>}/>
            <Route path="/decisions" element={<DecisionsPage/>}/>
        </Routes>
    );
}

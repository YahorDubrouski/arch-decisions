import {Route, Routes} from 'react-router-dom';
import {HomePage} from '@/pages/HomePage';
import {ContextBuilderPage} from '@/pages/ContextBuilderPage';
import {DecisionsPage} from '@/pages/DecisionsPage';
import {ArchitectureDecisionsPage} from '@/pages/ArchitectureDecisionsPage';
import {ArchitectureDecisionPage} from '@/pages/ArchitectureDecisionPage';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/context" element={<ContextBuilderPage/>}/>
            <Route path="/decisions" element={<DecisionsPage/>}/>
            <Route path="/architecture-decisions" element={<ArchitectureDecisionsPage/>}/>
            <Route path="/architecture-decisions/:decisionId" element={<ArchitectureDecisionPage/>}/>
        </Routes>
    );
}

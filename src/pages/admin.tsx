import { AdminTab } from '../components/AdminTab';
import Layout from '../components/Layout/Layout';

export default function AdminPage() {
    return (
        <Layout>
            <div className="pt-24">
                <AdminTab />
            </div>
        </Layout>
    );
} 
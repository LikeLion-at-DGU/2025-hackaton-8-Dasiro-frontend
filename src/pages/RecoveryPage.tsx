import { MapSeoulRisk } from '@features/recovery-zone';

const RecoveryPage = () => {
  const appkey = import.meta.env.VITE_KAKAO_JS_KEY;
  return (
    <div style={{ padding: '40px', fontSize: '24px', fontWeight: 'bold' }}>
      <MapSeoulRisk appKey={appkey} />
    </div>
  );
};

export default RecoveryPage;

import SponsorIntegrations from '@/components/SponsorIntegrations';

export default function Sponsors() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Hackathon Sponsor Integrations</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            SoundRights showcases cutting-edge Web3 technologies from our hackathon sponsors, 
            demonstrating real-world applications in music IP registration and blockchain connectivity.
          </p>
        </div>
        
        <SponsorIntegrations />
      </div>
    </div>
  );
}
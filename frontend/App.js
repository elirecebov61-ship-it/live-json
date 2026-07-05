import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Line } from 'react-chartjs-2';

const socket = io('http://localhost:3000');

function App() {
  const [match, setMatch] = useState({ team1: 'Manchester United', team2: 'Arsenal', odds: { home: 1.85, away: 3.20, draw: 3.80 } });
  const [chartData, setChartData] = useState({ labels: ['1', '2', '3', '4', '5'], datasets: [{ label: 'Home Odds', data: [1.85, 1.88, 1.90, 1.92, 1.95], borderColor: '#10b981' }] });

  useEffect(() => {
    socket.on('liveUpdate', (data) => {
      setMatch(data);
      setChartData({ labels: data.chartLabels || ['1', '2', '3', '4', '5'], datasets: [{ label: 'Home Odds', data: data.chartHome || [1.85, 1.88, 1.90, 1.92, 1.95], borderColor: '#10b981' }] });
    });
    return () => socket.off();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <h1 className="text-5xl font-bold mb-8">🚀 Railway Live Betting</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-2xl mb-4">📍 {match.team1} vs {match.team2}</h2>
          <div className="text-6xl font-mono mb-6">{match.odds.home} : {match.odds.away} : {match.odds.draw}</div>
          <button className="bg-emerald-500 px-8 py-4 rounded-xl text-xl font-bold">💰 Gerçek Para Yatır</button>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <Line data={chartData} options={{ responsive: true }} />
          <p className="text-xs text-zinc-500 mt-2">Canlı grafik – son 5 dakika odds değişimi</p>
        </div>
      </div>
    </div>
  );
}

export default App;

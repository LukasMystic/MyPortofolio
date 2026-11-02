import Game from '../components/Game';
import { Page, LargeTitle } from '../components/ui';

const GamePage = () => (
  <Page>
    <LargeTitle title="A small game" subtitle="Four in a row on a 6×6 board, against a minimax opponent or a friend." />
    <div className="rounded-card bg-elevated p-4 sm:p-6">
      <Game />
    </div>
  </Page>
);

export default GamePage;

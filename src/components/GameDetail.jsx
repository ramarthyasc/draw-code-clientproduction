import { Link } from 'react-router-dom';

//a game description component
function GameDetail(props) {
  const game = props.game;
  const difficulty = props.difficulty;
  return (
    <tr>
      <td><Link to="draw-code">{game}</Link></td>
      <td><Link to="draw-code">{difficulty}</Link></td>
    </tr>
  )
}

export default GameDetail;


import { Link } from 'react-router-dom'
import './statuscard.css'

const StatusCard = ({ card }) => {
    const { icon, value, title, to } = card

  return (
    <Link to={ to } className="status-card">
        <div className="status-card__icon">
            <i>{ icon() }</i>
        </div>
        <div className="status-card__info">
            <h4>{ value }</h4>
            <span>{ title }</span>
        </div>
    </Link>
  )
}

export default StatusCard
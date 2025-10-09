import PropTypes from 'prop-types';
import './Card.css';

function Card({ children, className = '', ...props }) {
  const cardClass = `card ${className}`.trim();

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;

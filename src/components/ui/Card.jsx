import PropTypes from 'prop-types';
import './Card.css';

/**
 * Card component - Reusable card container with variants
 * @param {Object} props - Component props
 * @param {node} props.children - Card content
 * @param {string} props.variant - Card variant (default, gradient, info)
 * @param {boolean} props.hoverable - Enable hover effects
 * @param {string} props.className - Additional CSS classes
 */
function Card({ children, variant = 'default', hoverable = true, className = '', ...props }) {
  const cardClass = `card card--${variant} ${hoverable ? 'card--hoverable' : ''} ${className}`.trim();

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'gradient', 'info']),
  hoverable: PropTypes.bool,
  className: PropTypes.string,
};

export default Card;

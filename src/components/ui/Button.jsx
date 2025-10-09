import PropTypes from 'prop-types';
import './Button.css';

function Button({
  children,
  variant = 'primary',
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const buttonClass = `btn btn-${variant} ${className}`.trim();

  return (
    <button type={type} className={buttonClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'submit']),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};

export default Button;

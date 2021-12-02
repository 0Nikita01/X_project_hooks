import cn from 'classnames';

const Input = ({label, value, type = 'text', name, onChange}) => {
    return (
        <div className={s.root}>
            <input 
                type={type} 
                name={name}
                value={value} 
                className={cn(s.input, s.valid)} 
                onChange={(e) => onChange(e.target.value)}
                required
            />
            <span className={s.highlight}></span>
            <span className={s.bar}></span>
            <label className={s.label}>{label}</label>
        </div>
    );
};

export default Input;
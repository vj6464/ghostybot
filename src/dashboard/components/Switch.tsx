interface Props {
  title?: string;
  checked?: boolean;
  onChange?: React.ChangeEventHandler;
}

const Switch: React.FC<Props> = (props: Props) => {
  return (
    <label title={props.title || ""} className="switch">
      <input onChange={props.onChange} checked={props.checked} {...props} type="checkbox" />
      <span className="slider"></span>
    </label>
  );
};

export default Switch;

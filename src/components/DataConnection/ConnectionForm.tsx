interface Props {
  sidebarActive: boolean;
}

export const ConnectionForm: React.FC<Props> = ({ sidebarActive }) => {
  return (
    <div
      className={`p-6 mx-0 sm:mx-6 rounded-xl bg-white shadow transition-all duration-300 w-full
        `}
    ></div>
  );
};

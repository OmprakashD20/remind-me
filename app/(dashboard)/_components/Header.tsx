interface HeaderProps {
  firstName: string;
  lastName: string;
}

const Header = ({ firstName, lastName }: HeaderProps) => {
  return (
    <div className="w-full mb-8 flex">
      <h1 className="text-4xl">
        <span className="font-bold">Welcome</span>, <br /> {firstName} {lastName}
      </h1>
    </div>
  );
};

export default Header;

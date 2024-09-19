// components/ui/Card.js
export const Card = ({ className = '', children }) => {
    return (
      <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
        {children}
      </div>
    );
  };
  
  export const CardHeader = ({ children }) => {
    return <div className="mb-4">{children}</div>;
  };
  
  export const CardTitle = ({ children }) => {
    return <h2 className="text-xl font-bold">{children}</h2>;
  };
  
  export const CardContent = ({ children }) => {
    return <div>{children}</div>;
  };
  
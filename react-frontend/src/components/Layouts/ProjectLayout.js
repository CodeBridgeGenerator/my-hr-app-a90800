import AppSideBar from "./appSideBar/AppSideBar.js";

/*

import ProductsPage from "../ProductsPage/ProductsPage";
import JobOpeningPage from "../JobOpeningPage/JobOpeningPage";
import ApplicationPage from "../ApplicationPage/ApplicationPage";
import EmployeePage from "../EmployeePage/EmployeePage";
import CandidatePage from "../CandidatePage/CandidatePage";
import TaskPage from "../TaskPage/TaskPage";
~cb-add-import~

~cb-add-services-card~

case "products":
                return <ProductsPage />;
case "jobOpening":
                return <JobOpeningPage />;
case "application":
                return <ApplicationPage />;
case "employee":
                return <EmployeePage />;
case "candidate":
                return <CandidatePage />;
case "task":
                return <TaskPage />;
~cb-add-thurthy~

*/

const AppLayout = (props) => {
  const { children, activeKey, activeDropdown } = props;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] mt-20 bg-white">
      <AppSideBar activeKey={activeKey} activeDropdown={activeDropdown} />
      <div className="flex-1 ml-2">{children}</div>
    </div>
  );
};

export default AppLayout;

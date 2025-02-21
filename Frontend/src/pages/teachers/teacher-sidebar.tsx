import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useEffect } from "react";
import { useUser } from "@/hooks/userContext";

export default function TeacherDashboard() {
  const location = useLocation();
  const { userId, userType, userName , userEmail ,setUser } = useUser();

  useEffect(() => {
    if (location.state?.userId && location.state?.userType && location.state?.userName && location.state?.userEmail) {
      setUser(location.state.userId, location.state.userType , location.state.userName , location.state.userEmail);
    }
  }, [location, setUser]);

  return (
    <SidebarProvider>
      <AppSidebar userId={userId ?? undefined} userType={userType ?? undefined}  userName={userName ?? undefined} userEmail={userEmail ?? undefined}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Teacher Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <hr />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-8">
          <h1 className="text-xl font-bold">Welcome, Teacher!</h1>
          <p className="text-muted-foreground">
            Manage your courses, students, and assignments here.
          </p>
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">📌 Course 1</div>
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">📌 Course 2</div>
            <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center">📌 Course 3</div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">
            📂 More Content Coming Soon...
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
    const pathname = usePathname();

    // Pages that should use the "with-filter" variant
    const filterPages = [
        "/category",
        "/cart",
        "/billing",
        "/admin",
    ];

    // Check if current path starts with /details/
    const isDetailsPage = pathname?.startsWith("/details/");

    // Check if this is an admin page
    const isAdminPage = pathname?.startsWith("/admin");

    // Determine if we should show the filter variant
    const showFilter = filterPages.includes(pathname || "") || isDetailsPage;

    return <Header variant={showFilter ? "with-filter" : "default"} isAdmin={!!isAdminPage} />;
}

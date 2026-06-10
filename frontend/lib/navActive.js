import { getTourById } from "@/data/tours";

export function isNavLinkActive(link, pathname, searchParams) {
  const [path, queryString] = link.href.split("?");

  if (path === "/") {
    return pathname === "/";
  }

  if (path === "/contact") {
    return pathname === "/contact";
  }

  if (path !== "/tours") {
    return pathname === path;
  }

  const linkParams = queryString ? new URLSearchParams(queryString) : null;
  const linkCategory = linkParams?.get("category");

  if (!linkCategory) {
    return false;
  }

  if (pathname === "/tours") {
    return searchParams.get("category") === linkCategory;
  }

  const detailMatch = pathname.match(/^\/tours\/([^/]+)$/);
  if (detailMatch) {
    const tour = getTourById(detailMatch[1]);
    return tour?.category === linkCategory;
  }

  return false;
}

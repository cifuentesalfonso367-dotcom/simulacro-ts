import { NextRequest, NextResponse } from "next/server";
import { verifyTokenEdge } from "./lib/jwt-edge";

const publicRoutes = ["/api/auth/login", "/api/auth/register"];
const rolePermissions: Record<string, string[]> = {};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // permitir acceso a las rutas publicas 

  if ( publicRoutes.some((route) => pathname.startsWith (route))) {
    return NextResponse.next();
  }


  // extraer el token del header de autorizacion 

  const authHeader = request.headers.get('authorization');
  if (!authHeader || ! authHeader?.startsWith('Bearer')) {
     return NextResponse.json(
      { sucess:false, message: 'No Autorizado. token faltante'}
      ,
      { status: 401}
     );
  }

  const token = authHeader.split('')[1];

// verificar el token usando la utilidad edge 

const decodedToken =  await verifyTokenEdge(token);
 
if (!decodedToken){
  return NextResponse.json(
    { succes: false, message: 'Token expirado o invalido.'},
    { status:401}
  );
}
 // control de acceso basado en roles (RBAC)
const useRole = decodedToken.role;
let isAuthorized= true;

for (const[route, allowedRoles] of Object.entries(rolePermissions)){
if ( pathname.startsWith(route)) {
  if (!allowedRoles.includes(useRole)){
    isAuthorized = false;
    break;
    }
  }
}

if (!isAuthorized){
  return NextResponse.json(
    {success: false, message: 'Aceeso denegado. permisos denegados.'},
    { status: 403}
  );
}

// inyectar datos de los usuarios en los headers para para los controladores

const requestHeaders = new Headers ( request.headers);
requestHeaders.set('x-user-id', decodedToken.userId);
requestHeaders.set('x-user-role', decodedToken.role);

return NextResponse.next({ 
  request:{
    headers: requestHeaders,
    },
  });
}
 export const config = {
  matcher: ['/api/:path*']
 };

import jwtDecode from 'jwt-decode';

export default function requireAuth(req: any, res: any, next: any) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Authentication invalid.' });
  }
  const decodedToken = jwtDecode(token.slice(7));

  if (!decodedToken) {
    return res.status(401).json({
      message: 'There was a problem authorizing the request.'
    });
  } else {
    req.user = decodedToken;
    next();
  }
}

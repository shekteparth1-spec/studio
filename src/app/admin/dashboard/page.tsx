import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { properties, users } from '@/lib/data';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const pendingProperties = properties.filter((p) => p.status === 'pending');

export default function AdminDashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Property Submissions</CardTitle>
        <CardDescription>
          Review and approve or reject new property listings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingProperties.map((property) => {
              const owner = users.find((u) => u.id === property.ownerId);
              return (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}<br/><span className="text-xs text-muted-foreground">{property.location}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={`https://i.pravatar.cc/40?u=${owner?.id}`} />
                         <AvatarFallback>{owner?.name.charAt(0)}</AvatarFallback>
                       </Avatar>
                       <span>{owner?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{property.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8 border-green-500 text-green-500 hover:bg-green-500/10 hover:text-green-600">
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive/90">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Reject</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
             {pendingProperties.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No pending submissions.</TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

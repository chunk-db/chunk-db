import { ISpace } from '@chunk-db/core';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React from 'react';

interface IProps {
    space: ISpace;
}

export function SpaceCard({ space }: IProps) {
    const refs = Object.keys(space.refs)
                       .map(ref => ({ ref, chunk: space.refs[ref] }));

    return (
        <Card>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe">
                        S
                    </Avatar>
                }
                title={space.name}
                subheader={space.id}
            />
            <CardContent>
                <Typography gutterBottom>
                    Description: {space.description || <i>(empty)</i>}
                </Typography>
                <Table
                    size="small"
                    stickyHeader
                    aria-label="a dense table"
                    component={Paper}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>Ref</TableCell>
                            <TableCell align="right">Chunk</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {refs.map((row) => (
                            <TableRow key={row.ref}>
                                <TableCell component="th" scope="row">
                                    {row.ref}
                                </TableCell>
                                <TableCell align="right">{row.chunk}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

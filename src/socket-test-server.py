import socket
import sys
import os

#https://pymotw.com/2/socket/uds.html

server_address = 'ImageNomeR.socket'

try:
	os.unlink(server_address)
except OSError:
	if os.path.exists(server_address):
		raise

with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as sock:
	print(f'starting up on {address}')
	sock.bind(server_adress)

	print('Waiting for a connection')
	sock.listen(1)
	
	while True:
		con, client = sock.accept()
		

	

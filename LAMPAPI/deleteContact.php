<?php
	$inData = getRequestInfo();
	
	$FirstName = $inData["FirstName"];
    	$LastName = $inData["LastName"];
    	$Phone = $inData["Phone"];
    	$Email = $inData["Email"];
	$UserID = $inData["UserId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("DELETE from Contacts where (FirstName = ? or LastName = ? or Phone = ? or Email = ?) and UserID = ?");
		$stmt->bind_param("sssss", $FirstName, $LastName, $Phone, $Email, $UserID);
		$stmt->execute();

        if ($stmt->affected_rows > 0)
		{
			returnWithError(""); // Success, no error
		}
		else
		{
			returnWithError("No Records found to Delete");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>

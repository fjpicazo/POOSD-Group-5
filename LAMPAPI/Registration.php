<?php

	$inData = getRequestInfo();

	$firstName = "";
	$lastName = "";
	$login = "";
	$password = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();

        // Determine if username already exists
		if( $result->fetch_assoc() )
		{
			returnWithError("Username already exists");
		}

        // If username does not exist, then add the user to the database 
		else
		{
			$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
			$stmt->bind_param("ssss", $inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);

			if($stmt->execute())
			{
				returnWithInfo($inData["firstName"], $inData["lastName"]);
			}
			else
			{
				returnWithError("Error inserting user");
			}
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $firstName, $lastName )
	{
		$retValue = '{"id":0,"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>

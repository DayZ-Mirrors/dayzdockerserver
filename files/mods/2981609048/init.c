--- init.c	2023-12-22 09:06:49.416111938 +0000
+++ init.c.new	2023-12-22 09:08:58.365653156 +0000
@@ -1,34 +1,19 @@
 void main()
 {
-	//INIT ECONOMY--------------------------------------
-	Hive ce = CreateHive();
-	if ( ce )
-		ce.InitOffline();
-
-	//DATE RESET AFTER ECONOMY INIT-------------------------
+	CreateHive();
+	GetHive().InitOffline();
 	int year, month, day, hour, minute;
-	int reset_month = 9, reset_day = 20;
-	GetGame().GetWorld().GetDate(year, month, day, hour, minute);
+	GetGame().GetWorld().GetDate( year, month, day, hour, minute );
 
-	if ((month == reset_month) && (day < reset_day))
+	//Change here the dates for whatever months you desire
+	if ( month < 12 )
 	{
-		GetGame().GetWorld().SetDate(year, reset_month, reset_day, hour, minute);
+		year = 2011;
+		month = 12;
+		day = 25;
+		GetGame().GetWorld().SetDate( year, month, day, hour, minute );
 	}
-	else
-	{
-		if ((month == reset_month + 1) && (day > reset_day))
-		{
-			GetGame().GetWorld().SetDate(year, reset_month, reset_day, hour, minute);
-		}
-		else
-		{
-			if ((month < reset_month) || (month > reset_month + 1))
-			{
-				GetGame().GetWorld().SetDate(year, reset_month, reset_day, hour, minute);
-			}
-		}
-	}
-}
+} 
 
 class CustomMission: MissionServer
 {
@@ -95,4 +80,4 @@
 Mission CreateCustomMission(string path)
 {
 	return new CustomMission();
-}
\ No newline at end of file
+}

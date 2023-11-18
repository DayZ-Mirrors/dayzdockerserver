--- init.c	2023-11-17 20:59:30.977503823 +0000
+++ init.c.new	2023-11-17 21:01:06.501035495 +0000
@@ -1,46 +1,18 @@
 void main()
 {
-	//INIT WEATHER BEFORE ECONOMY INIT------------------------
-	//Weather weather = g_Game.GetWeather();
-	//weather.MissionWeather(false);    // false = use weather controller from Weather.c
-	//weather.GetOvercast().Set( Math.RandomFloatInclusive(0.4, 0.6), 1, 0);
-	//weather.GetRain().Set( 0, 0, 1);
-	//weather.GetFog().Set( Math.RandomFloatInclusive(0.05, 0.1), 1, 0);
-
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
-	
-	GetGame().GetWorld().GetDate(year, month, day, hour, minute);
+	GetGame().GetWorld().GetDate( year, month, day, hour, minute );
 
-	if ((month == reset_month) && (day < reset_day))
-	{
-		GetGame().GetWorld().SetDate(year, reset_month, reset_day, hour, minute);
-	}
-	else
+	//Change here the dates for whatever months you desire
+	if ( month < 12 )
 	{
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
+		year = 2011;
+		month = 12;
+		day = 25;
+		GetGame().GetWorld().SetDate( year, month, day, hour, minute );
 	}
-	
-    //CEApi TestHive = GetCEApi();
-    //TestHive.ExportProxyProto();
-    //TestHive.ExportProxyData( "8096 0 8096", 16384 );
-    //TestHive.ExportClusterData() ;	  	
 }
 
 class CustomMission: MissionServer

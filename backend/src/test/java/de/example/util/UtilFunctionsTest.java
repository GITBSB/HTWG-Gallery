package de.example.util;
import org.junit.Assert;
import org.junit.Test;

public class UtilFunctionsTest {

   @Test
   public void roundTest() {
       Assert.assertEquals(3.457, UtilFunctions.round(3.45678,3), 0);
   }

}

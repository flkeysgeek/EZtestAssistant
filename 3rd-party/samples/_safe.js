			
            <fieldset style="float:left;text-align:left;padding:0px 9px 3px;margin-bottom:5px">
            <legend>last run</legend>
              <label>
                <input type="radio" name="EZtester_runTime" value="all" id="EZtester_runAll"
                    onClick="EZtester('EZchoice',this)">
                any time</label>
                <br>
              <label>
                <input type="radio" name="EZtester_runTime" value="today" id="EZtester_runToday"
                    onClick="EZtester('EZchoice',this)">
                today</label>
                <br>
              <label>
                <input type="radio" name="EZtester_runTime" value="hour" id="EZtester_runLastHour"
                    onClick="EZtester('EZchoice',this)">
                last hour</label>
            </fieldset>
            <fieldset style="float:left;padding:0px 9px 3px;text-align:left;margin-left:15px">
                <legend>last status</legend>
              <label>
                <input type="radio" name="EZtester_runType" value="hour" id="EZtester_runBoth"
                    onClick="EZtester('EZchoice',this)">
              any</label>
                <br>
              <label>
                <input type="radio" name="EZtester_runType" value="today" id="EZtester_runFailed"
                    onClick="EZtester('EZchoice',this)">
              failed</label>
                <br>
              <label>
                <input type="radio" name="EZtester_runType" value="all" id="EZtester_runPassed"
                    onClick="EZtester('EZchoice',this)">
              passed</label>
            </fieldset>
            <div style="float:right" align="center">
              <p>
              <input name="EZtester_runNow" type="button" id="EZtester_runNow" onClick="EZtester('runNow')" value="start">
			  </p><p>
              <input name="EZtester_runCancel" type="button" id="EZtester_runCancel" onClick="EZtester('runCancel')" value="cancel">
              </p>
            </div>

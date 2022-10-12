import React, { useEffect, useState } from 'react';
import useKeypress from 'react-use-keypress';
import './board.css';
import { checkForWumpus, checkForPit } from './functionalities';
import agent from '../images/agent.png';
import wumpus from '../images/wumpus.png';
import gold from '../images/gold.png'
import pit from '../images/pit.png'
import stenchagent from '../images/stench.png'
import breezeagent from '../images/breeze.png'
import breezestench from '../images/breeze_stench.png'
import { BoardState, CellProperty } from './BoardState';

/*
    Cell classes:
    =============
    - unvisited (blurred)
    - safe
    - stench
    - breeze
    - agentsafe
    - agentstinky
    - agentbreeze
    - wumpus (blurred)
    - pit (blurred)
    - gold (blurred)
    - agentwumpus
    - agentpit
    - agentgold
*/

const Board = () => {

	let input = [
				'A','S','S','W','S','S','S','S','S','S',
				'S','S','P','S','S','S','S','S','S','S',
				'S','S','W','S','S','G','S','S','S','S',
				'S','S','S','P','S','S','S','S','S','S',
				'S','S','S','S','G','S','S','S','S','S',
				'S','S','S','S','S','S','P','S','S','S',
				'S','S','S','S','S','S','S','S','S','S',
				'S','S','S','S','S','S','S','S','S','S',
				'S','S','S','S','S','S','S','S','S','S',
				'S','S','S','S','S','S','S','S','S','S'
			];
	const [boardState, setBoardState] = useState(new BoardState(input))
	//let boardState = new BoardState(input)
    const [agentAddress, setAgentAddress] = useState(boardState.getInitialAgentAddress());
	const [prevagentAddress, setPrevAgentAddress] = useState(Array(100).fill(-1));
	let visitingSeq = Array(100)
	let turn = false;

	function agentVisits(to){
		// return new Promise(resolve => {
			setAgentAddress(to)
			boardState.agentVisits(to)
			setBoardState(boardState);
		// }).resolve
	}

	function GoAgent(){
		let tempprev = [...prevagentAddress]
		let unvisiteds = Array.from(boardState.getUnvisitedAdjascents(agentAddress))
		if(boardState.getCellClass(agentAddress) == 'safe' && unvisiteds.length!=0){
			console.log(unvisiteds[0]);
			tempprev[unvisiteds[0]] = agentAddress
			setPrevAgentAddress(tempprev)
			agentVisits(unvisiteds[0])
		}
		else{
			console.log("sd");
			//setPrevAgentAddress(agentAddress)
			if(prevagentAddress[agentAddress]!=-1)
				agentVisits(prevagentAddress[agentAddress])
			else console.log("No move available");
		}
		
	}
	
	function getVisitingSeq(tempAgent,ind){
		visitingSeq[ind] = tempAgent
		boardState.PossibleMovesForCell(tempAgent)
		let connections = Array.from(boardState.getPossibleMovesFromCell(tempAgent))
		if(connections.length==0) return;
		console.log(connections);
		let o = 0;

		for (let i = 0; i < connections.length;i++) {
			if(boardState.getIsCellVisited(connections[i])) continue
			getVisitingSeq(connections[i],ind++)
			
			// setTimeout(()=> GoAgent(connections[i]),2000 )
			//agentVisits(tempAgent)
		}
	}

	useKeypress(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown','Enter'], (event) => {
		if (event.key === 'ArrowLeft') {
			if(agentAddress%10 !== 0) agentVisits(agentAddress - 1)
		}
		if (event.key === 'ArrowRight') {
			if((agentAddress+1)%10 !== 0) agentVisits(agentAddress + 1)
		}
		if (event.key === 'ArrowUp') {
			if(agentAddress-10 >= 0) agentVisits(agentAddress - 10)
		}
		if (event.key === 'ArrowDown') {
			if(agentAddress+10 < 100) agentVisits(agentAddress + 10)
		}
		if (event.key === 'Enter') {
			GoAgent()
		}
	});

	const Cell = ({ num }) => {
		return <td className={boardState.getCellClass(num)}>
                    <div>
                        {
							num == agentAddress && (boardState.getCellClass(num) === 'safe' || boardState.getCellClass(num) === 'unvisited') ?
                            	<img src={agent} alt="agent" height={70} width={70}/>
								:
								<></>
						}
						{
							num == agentAddress && boardState.getCellClass(num) === 'stench' ?
                            	<img src={stenchagent} alt="stenchagent" height={70} width={70}/>
								:
								<></>
						}
						{
							num == agentAddress && boardState.getCellClass(num) === 'breeze' ?
                            	<img src={breezeagent} alt="breezeagent" height={70} width={70}/>
								:
								<></>
						}
						{
							boardState.getAvatar(num) === 'wumpus'?
							<img src={wumpus} alt="wumpus" height={70} width={70}/>
							:
							<></>
						}
						{
							boardState.getAvatar(num) === 'pit'?
							<img src={pit} alt="pit" height={70} width={70}/>
							:
							<></>
						}
						{
							boardState.getAvatar(num) === 'gold'?
							<img src={gold} alt="gold" height={70} width={70}/>
							:
							<></>
						}
                    </div>
            </td>;
	};

    var t = 0;

	return (
		<div className='container mt-5' id='main'>
			<table className="box">
				<tbody>
					<tr>
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
					</tr>
					<tr>
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
					</tr>
					<tr>
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
					</tr>
					<tr>
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
					</tr>
					<tr>
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
					</tr>
					<tr>
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
					</tr>
					<tr>
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
					</tr>
					<tr>
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
					</tr>
					<tr>
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
					</tr>
					<tr>
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
						<Cell num={t++} />
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default Board;